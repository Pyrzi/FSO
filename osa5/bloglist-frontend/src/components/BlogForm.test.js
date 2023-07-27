import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen, fireEvent  } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


describe("BlogForm tests", () => {
    test('Blogform calls for creation function when prompted', async () => {
    const createBlogMock = jest.fn()
    const { container } = render(<BlogForm createBlog={createBlogMock} />)


    // Find the input fields and submit button
    const titleInput = container.querySelector("input[name='title']")
    const authorInput = container.querySelector("input[name='author']")
    const urlInput = container.querySelector("input[name='url']")
    const createButton = screen.getByText('create')

    // Fill in the form fields
    await userEvent.type(titleInput, 'Test Blog Title')
    await userEvent.type(authorInput, 'John Doe')
    await userEvent.type(urlInput, 'https://testblog.com')
    await fireEvent.click(createButton)

    // Check that the callback function is called with the correct data
    expect(createBlogMock).toHaveBeenCalledTimes(1)
    expect(createBlogMock).toHaveBeenCalledWith('Test Blog Title', 'John Doe', 'https://testblog.com')
    })
})