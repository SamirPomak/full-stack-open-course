import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';
import BlogForm from './BlogForm';

describe('<BlogForm />', () => {
  let container, handleCreateNewBlog, testUser;
  const newBlog = {
    author: 'root',
    title: 'New blog4',
    url: 'test.com',
  };

  beforeEach(() => {
    testUser = userEvent.setup();
    handleCreateNewBlog = vi.fn();
    container = render(
      <BlogForm handleCreateNewBlog={handleCreateNewBlog} />
    ).container;
  });

  test('form calls submit function with correct details', async () => {
    const authorInput = screen.getByPlaceholderText('enter author');
    const titleInput = screen.getByPlaceholderText('enter title');
    const urlInput = screen.getByPlaceholderText('enter url');
    await testUser.type(authorInput, newBlog.author);
    await testUser.type(titleInput, newBlog.title);
    await testUser.type(urlInput, newBlog.url);

    const submitButton = screen.getByText('create');
    await testUser.click(submitButton);
    expect(handleCreateNewBlog).toHaveBeenCalled();
    expect(handleCreateNewBlog.mock.calls[0][0]).toMatchObject(newBlog);
  });
});
