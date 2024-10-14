import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import { expect, vi } from 'vitest';

describe('<Blog />', () => {
  let container, handleLike, handleDelete, testUser;
  const blog = {
    author: 'root',
    id: '66e45f800c0f9f98440584a5',
    likes: 4,
    title: 'New blog4',
    url: 'test.com',
    user: {
      blogs: ['66e452109f075026103aa9e2'],
      id: '66e451de9f075026103aa9de',
      username: 'root1',
    },
  };
  const activeUser = { username: 'root' };

  beforeEach(() => {
    testUser = userEvent.setup();
    handleLike = vi.fn();
    handleDelete = vi.fn();
    container = render(
      <Blog
        blog={blog}
        handleLike={handleLike}
        handleDelete={handleDelete}
        user={activeUser}
      ></Blog>
    ).container;
  });

  test('should render at start author and title but not url or likes', async () => {
    const title = await screen.findByText('New blog4', { exact: false });
    const author = await screen.findByText('root', { exact: false });
    const likesElement = screen.queryByTestId('likes');
    const urlElement = screen.queryByTestId('url');

    expect(title).toBeTruthy();
    expect(author).toBeTruthy();
    expect(likesElement).toBeNull();
    expect(urlElement).toBeNull();
  });

  test('after clicking on "view" button url and likes should be show', async () => {
    const viewButton = screen.getByText('view');
    await testUser.click(viewButton);
    await screen.findByTestId('likes');
    await screen.findByTestId('url');
  });

  test('if the like button is clicked twice, event handler for it is called twic', async () => {
    const viewButton = screen.getByText('view');
    await testUser.click(viewButton);
    const likeButton = screen.getByText('like');
    await testUser.click(likeButton);
    await testUser.click(likeButton);
    expect(handleLike.mock.calls.length).toEqual(2);
  });
});
