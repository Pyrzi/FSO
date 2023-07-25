const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
      return null
    }
    const mostLikedBlog = blogs.reduce((prev, current) =>
      prev.likes > current.likes ? prev : current
    )
    return {
      title: mostLikedBlog.title,
      author: mostLikedBlog.author,
      likes: mostLikedBlog.likes,
    }
  }

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
      return null
    }
    const blogCounts = {};
    blogs.forEach((blog) => {
      if (blogCounts[blog.author]) {
        blogCounts[blog.author]++
      } else {
        blogCounts[blog.author] = 1
      }
    })
    const mostBlogsAuthor = Object.keys(blogCounts).reduce((prev, current) =>
      blogCounts[prev] > blogCounts[current] ? prev : current
    )
    return {
      author: mostBlogsAuthor,
      blogs: blogCounts[mostBlogsAuthor],
    }
  }

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const likeCounts = {}

    blogs.forEach((blog) => {
        if (likeCounts[blog.author]) {
        likeCounts[blog.author] += blog.likes
        } else {
        likeCounts[blog.author] = blog.likes
        }
    })

    const mostLikesAuthor = Object.keys(likeCounts).reduce((prev, current) =>
        likeCounts[prev] > likeCounts[current] ? prev : current
    )

    return {
        author: mostLikesAuthor,
        likes: likeCounts[mostLikesAuthor]
      }
}

module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes}