import { serverFetch } from './serverFetch';

// ---------------------------------------------------------------------------
// Raw GraphQL query strings
// ---------------------------------------------------------------------------

const GET_HOME_SCREENS_CATEGORIES = /* GraphQL */ `
  query getHomeScreensCategories {
    homeScreens {
      id
      category {
        id
        name
      }
    }
  }
`;

const GET_CATEGORY = /* GraphQL */ `
  query getCategory($id: ID!) {
    category(id: $id) {
      id
      name
      videos {
        id
        title
        duration {
          minutes
          seconds
        }
        landscapeThumbnail
      }
    }
  }
`;

const GET_ORIGINAL_VIDEO = /* GraphQL */ `
  query getOriginalVideo($id: ID!) {
    originalVideo(id: $id) {
      title
      description
      landscapeThumbnail
      likeNum
      duration {
        minutes
        seconds
      }
    }
  }
`;

const GET_VIDEO_COMMENTS = /* GraphQL */ `
  query getVideoComments($id: ID!, $first: Int, $after: String) {
    videoComments(id: $id, first: $first, after: $after) {
      id
      allCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          contents
          user {
            id
            name
            avatar
          }
          createdAt
          likeNum
        }
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Duration {
  minutes: number;
  seconds: number;
}

export interface Film {
  id: string;
  title: string;
  duration: Duration;
  landscapeThumbnail: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface HomeScreenEntry {
  id: string;
  category: Category;
}

export interface CategoryWithFilms {
  id: string;
  name: string;
  videos: Film[];
}

export interface OriginalVideo {
  title: string;
  description: string;
  landscapeThumbnail: string;
  likeNum: number;
  duration: Duration;
}

export interface CommentUser {
  id: string;
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  contents: string;
  user: CommentUser;
  createdAt: string;
  likeNum: number;
}

export interface CommentEdge {
  cursor: string;
  node: Comment;
}

export interface PageInfo {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface VideoComments {
  id: string;
  allCount: number;
  pageInfo: PageInfo;
  edges: CommentEdge[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function formatDuration({ minutes, seconds }: Duration): string {
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Query key factories
// ---------------------------------------------------------------------------

export const queryKeys = {
  homeScreensCategories: ['homeScreensCategories'] as const,
  category: (id: string) => ['category', id] as const,
  originalVideo: (id: string) => ['originalVideo', id] as const,
  videoComments: (id: string) => ['videoComments', id] as const,
};

// ---------------------------------------------------------------------------
// Query functions (usable both server-side and client-side)
// ---------------------------------------------------------------------------

export async function fetchHomeScreensCategories(): Promise<HomeScreenEntry[]> {
  const data = await serverFetch<{ homeScreens: HomeScreenEntry[] }>(
    GET_HOME_SCREENS_CATEGORIES,
  );
  return data.homeScreens;
}

export async function fetchCategory(id: string): Promise<CategoryWithFilms> {
  const data = await serverFetch<{ category: CategoryWithFilms }>(
    GET_CATEGORY,
    { id },
  );
  return data.category;
}

export async function fetchOriginalVideo(id: string): Promise<OriginalVideo> {
  const data = await serverFetch<{ originalVideo: OriginalVideo }>(
    GET_ORIGINAL_VIDEO,
    { id },
  );
  return data.originalVideo;
}

export async function fetchVideoComments(
  id: string,
  first = 10,
  after?: string,
): Promise<VideoComments> {
  const data = await serverFetch<{ videoComments: VideoComments }>(
    GET_VIDEO_COMMENTS,
    { id, first, after },
  );
  return data.videoComments;
}
