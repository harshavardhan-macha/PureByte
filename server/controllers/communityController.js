import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

const formatUser = (user) => {
  if (!user) return { id: "", name: "Unknown", email: "" };
  return {
    id: user._id?.toString() || user.id,
    name: user.name,
    email: user.email,
  };
};

const enrichPost = async (post, currentUserId) => {
  const author = await User.findById(post.userId).select("name email");
  const commentCount = await Comment.countDocuments({ postId: post._id });
  const uid = currentUserId.toString();
  const likedByMe = (post.likes || []).some((id) => id.toString() === uid);

  return {
    id: post._id.toString(),
    caption: post.caption || "",
    imageUrl: post.imageUrl,
    createdAt: post.createdAt,
    author: formatUser(author),
    likeCount: post.likes?.length || 0,
    likedByMe,
    commentCount,
  };
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50);
    const enriched = await Promise.all(posts.map((p) => enrichPost(p, req.user._id)));
    res.json({ items: enriched });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load community posts" });
  }
};

export const createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "An image is required for each post" });
    }

    const caption = (req.body.caption || "").trim();
    const imageUrl = `/uploads/${req.file.filename}`;

    const post = await Post.create({
      userId: req.user._id,
      caption,
      imageUrl,
      likes: [],
    });

    const enriched = await enrichPost(post, req.user._id);
    res.status(201).json(enriched);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not create post" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const uid = req.user._id;
    const alreadyLiked = post.likes.some((id) => id.equals(uid));

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => !id.equals(uid));
    } else {
      post.likes.push(uid);
    }

    await post.save();

    res.json({
      id: post._id.toString(),
      likeCount: post.likes.length,
      likedByMe: !alreadyLiked,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not update like" });
  }
};

export const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ postId: post._id })
      .sort({ createdAt: 1 })
      .limit(100);

    const userIds = [...new Set(comments.map((c) => c.userId.toString()))];
    const users = await User.find({ _id: { $in: userIds } }).select("name email");
    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

    res.json({
      items: comments.map((c) => ({
        id: c._id.toString(),
        text: c.text,
        createdAt: c.createdAt,
        author: formatUser(userMap[c.userId.toString()]),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load comments" });
  }
};

export const addComment = async (req, res) => {
  try {
    const text = (req.body.text || "").trim();
    if (!text) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      postId: post._id,
      userId: req.user._id,
      text,
    });

    res.status(201).json({
      id: comment._id.toString(),
      text: comment.text,
      createdAt: comment.createdAt,
      author: formatUser(req.user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not add comment" });
  }
};
