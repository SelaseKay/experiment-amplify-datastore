import { useEffect, useState } from 'react'
import './App.css'
import { DataStore } from 'aws-amplify/datastore';
import { POST, PostStatus } from './models';

function App() {
  const [post, setPost] = useState<POST[] | undefined>();
  const [postTitle, setPostTitle] = useState<string>();


  useEffect(() => {
    const sub = DataStore.observeQuery(POST
    ).subscribe(({ items }) => {
      console.log('REMOTE POSTS >>> ', items)
      setPost(items)
    })

    getPosts()

    return () => {
      sub.unsubscribe();
    };
  }, []);

  async function getPosts() {
    const posts = await DataStore.query(POST)
    console.log("CACHED POSTS >>>>> ", posts)
  }

  /**
   * Create a new Post
   */
  async function onCreate() {
    console.log("Create new post");
    await DataStore.save(
      new POST({
        title: `${postTitle}`,
        rating: Math.floor(Math.random() * (8 - 1) + 1),
        status: PostStatus.ACTIVE
      })
    );
    const posts = await DataStore.query(POST)
    setPost(posts)
    setPostTitle("")
  }

  return (
    <>
      {/* <h1>{post?.title}</h1> */}
      <input
        // disabled={!post}
        type="button"
        value="Clear cache"
        onClick={async () => {
         await DataStore.clear()
         setPost([])
        }}
      />
      <input
        // disabled={!post}
        type="text"
        value={postTitle ?? ""}
        onChange={({ target: { value } }) => {
          setPostTitle(value)
          /**
           * Each keypress updates the post in local React state.
           */
          // if (post)
          //   setPost(
          //     POST.copyOf(post, (draft) => {
          //       draft.title = value;
          //     })
          //   );
        }}
      />
      <input
        // disabled={!post}
        type="button"
        value="Add Post"
        onClick={async () => {
          onCreate()
        }}
      />

      <ul>
        {post?.map(item => (
          <li key={item.id}>{item.title ?? ""}</li>
        ))}
      </ul>
    </>
  );
}

export default App
