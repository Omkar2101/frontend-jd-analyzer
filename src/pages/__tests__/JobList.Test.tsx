import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test-utils";
import JobList from "../Joblist";
import axios from "axios";

// === Mock axios ===
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

// === Mock useAuth hook ===
let mockUserEmail: string | null = null;
let mockIsLoading = false;

vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn().mockImplementation(() => ({
    userEmail: mockUserEmail,
    isLoading: mockIsLoading,
    logout: vi.fn(),
  })),
}));

// === Mock Job Data 
const mockJobs = [
  {
    id: "1",
    title: "Software Engineer",
    originalText: "Looking for a software engineer...",
    improvedText: "Looking for a software developer...",
    fileName: "job1.txt",
    createdAt: "2024-01-15T10:30:00Z",
    analysis: {
      bias_score: 0.8,
      inclusivity_score: 0.9,
      clarity_score: 0.7,
    },
  },
];

describe("JobList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserEmail = "user@example.com";
    mockIsLoading = false;
  });

  it("shows loading state initially", () => {
    // Set loading to true for this test
    mockIsLoading = true;
    
    render(<JobList />);

    expect(screen.getByText("Loading your job listings...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("displays job listings when data is loaded", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockJobs });

    render(<JobList />);

    await waitFor(() => {
      expect(screen.getByText(/your job listings/i)).toBeInTheDocument();
      expect(screen.getByText(/job1.txt/i)).toBeInTheDocument();
      expect(screen.getByText(/bias: 0.8/i)).toBeInTheDocument();
      expect(screen.getByText(/inclusivity: 0.9/i)).toBeInTheDocument();
      expect(screen.getByText(/clarity: 0.7/i)).toBeInTheDocument();
    });
  });

  it("shows empty state when no jobs exist", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    render(<JobList />);

    await waitFor(() => {
      expect(screen.getByText(/no job listings found/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /analyze new job/i })).toBeInTheDocument();
    });
  });

  it("shows error state when API fails", async () => {
    mockedAxios.get.mockRejectedValue(new Error("API Error"));

    render(<JobList />);

    await waitFor(() => {
      expect(
        screen.getByText(/failed to fetch job listings/i)
      ).toBeInTheDocument();
    });
  });

  it("does not render jobs while auth is still loading", () => {
    mockIsLoading = true;
    mockUserEmail = null;

    render(<JobList />);

    // Should show loading state, not the job listings
    expect(screen.getByText("Loading your job listings...")).toBeInTheDocument();
    // Look for the specific header that appears in the main job listings view
    expect(screen.queryByRole("heading", { name: /your job listings/i })).not.toBeInTheDocument();
  });

  it("shows login error if user is not logged in", async () => {
    mockUserEmail = null;
    mockIsLoading = false;

    render(<JobList />);

    await waitFor(() => {
      expect(
        screen.getByText(/please log in to view your job listings/i)
      ).toBeInTheDocument();
    });
  });
});