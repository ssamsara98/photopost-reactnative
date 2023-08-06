// auth
export type RegisterReq = {
  email: string;
  username: string;
  password: string;
  name: string;
};
export type RegisterRes = {
  type: string;
  token: string;
};

export type LoginReq = {
  userSession: string;
  password: string;
};
export type LoginRes = {
  type: string;
  accessToken: string;
  refreshToken: string;
};

export type Sig = {type: string; accessToken: string; refreshToken: string};

export type RenewTokensReq = {
  refreshToken: string;
};

// posts
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
  photos: (PostPhoto & {photo: Photo})[];
} & {
  author: User;
};

export type Pagination = {
  count: number;
  hasNext: boolean;
};

export type PaginationResp<R, P = Pagination> = {
  pagination: P;
  result: R;
};

export type PostListResp = PaginationResp<PostWithPhotos[]>;

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
