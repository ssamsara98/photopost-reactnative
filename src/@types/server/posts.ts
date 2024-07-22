import { PaginationCursorMeta, PaginationMeta, PaginationResp } from './pagination';

/* posts */
export type User = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  email: string;
  username: string;
  password: string;
  name: string;
  sexType: string;
  birthdate: Date;
};

export type Post = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  authorId: number;
  author: User;
  caption: string;
  isPublished: boolean;
};

export type Photo = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  keypath: string;
};

export type PostPhoto = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  position: number;
  postId: string;
  photoId: string;
};

export type PostWithPhotos = Post & {
  photos: (PostPhoto & { photo: Photo })[];
} & {
  author: User;
};

export type PostListResp = PaginationResp<PaginationCursorMeta, PostWithPhotos>;
export type PostListMineResp = PaginationResp<PaginationMeta, PostWithPhotos>;

export type UploadImageServerRes = {
  photo: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    keypath: string;
  };
};

export type CreatePostListResp = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  authorId: number;
  caption: string;
  isPublished: boolean;
  photos: null;
};
