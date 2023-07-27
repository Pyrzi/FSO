import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen, fireEvent  } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe("Blog tests", () => {
const blog = {
    title: 'test blog',
    author: '',
    url: '.fi',
    likes: 0,
    user: {
      username: "username",
      name: "name",
    }
}
const addLikeMock = jest.fn()
beforeEach(() => {
    render(<Blog blog={blog} addLike={addLikeMock} />)

})
test('renders title but not url or likes', () => {


  const element = screen.getByText('test blog')
  expect(element).toBeDefined()
  expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
  expect(screen.queryByText("like")).not.toBeInTheDocument()

})

test('shows url and likes when button is pressed', () => {

    const showButton = screen.getByText('show')
    fireEvent.click(showButton)
  
    expect(screen.getByText(blog.url)).toBeInTheDocument()
    expect(screen.getByText(`likes ${blog.likes}`)).toBeInTheDocument()
    expect(screen.getByText(blog.user.name)).toBeInTheDocument()
})

test('Eventhandler is called twice when like button is clicked twice', () => {
    const showButton = screen.getByText('show')
    fireEvent.click(showButton)

    const likeButton = screen.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
  
    expect(addLikeMock).toHaveBeenCalledTimes(2)
  })

})