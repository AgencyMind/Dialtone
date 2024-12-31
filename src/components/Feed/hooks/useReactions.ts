import { StorageClient } from "@lens-protocol/storage-node-client";
import { SetStateAction, useState } from "react";
import createPost from "../../../../graphql/lens/mutations/createPost";
import { MainContentFocus, SessionClient } from "@lens-protocol/client";
import { v4 as uuidv4 } from "uuid";
import createRepost from "../../../../graphql/lens/mutations/createRepost";
import addReaction from "../../../../graphql/lens/mutations/addReaction";

const useReactions = (
  storageClient: StorageClient,
  sessionClient: SessionClient,
  setSignless: (e: SetStateAction<boolean>) => void,
  setIndexer: (e: SetStateAction<string | undefined>) => void,
  setNotification: (e: SetStateAction<string | undefined>) => void,
  id: string,
  reaction: string,
  gifOpen: { id: string; gif: string } | undefined
) => {
  const [content, setContent] = useState<string>("");
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [interactionsLoading, setInteractionsLoading] = useState<{
    mirror: boolean;
    like: boolean;
  }>({
    mirror: false,
    like: false,
  });
  const [commentQuote, setCommentQuote] = useState<
    "Comment" | "Quote" | undefined
  >();

  const handleComment = async () => {
    if (!commentQuote) return;
    setPostLoading(true);
    try {
      let focus = MainContentFocus.TextOnly;
      let schema = "https://json-schemas.lens.dev/posts/text/3.0.0.json";
      let image = {};
      if (gifOpen?.id == commentQuote) {
        focus = MainContentFocus.Image;
        schema = "https://json-schemas.lens.dev/posts/image/3.0.0.json";
        image = {
          type: "image/png",
          item: gifOpen?.gif,
        };
      }

      const { uri } = await storageClient.uploadAsJson({
        $schema: schema,
        lens: {
          mainContentFocus: focus,
          title: content?.slice(0, 10),
          content: content,
          id: uuidv4(),
          locale: "en",
          ...image,
          tags: ["dialtone"],
        },
      });

      const res = await createPost(
        {
          contentUri: uri,
          commentOn: {
            post: id,
          },
        },
        sessionClient!
      );

      if (
        (res as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res as any)?.hash) {
        setContent("");
        setCommentQuote(undefined);
        setIndexer?.("Comment Indexing");
      } else {
        setNotification?.("Something went wrong :( Try again?");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  const handleLike = async () => {
    setInteractionsLoading({
      ...interactionsLoading,
      like: true,
    });
    try {
      const res = await addReaction(
        {
          post: id,
          reaction,
        },
        sessionClient!
      );

      if (
        (res as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res as any)?.success) {
        setIndexer?.("Reaction Success");
      } else {
        setNotification?.("Something went wrong :( Try again?");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionsLoading({
      ...interactionsLoading,
      like: false,
    });
  };

  const handleMirror = async () => {
    setInteractionsLoading({
      ...interactionsLoading,
      mirror: true,
    });
    try {
      const res = await createRepost(
        {
          post: id,
        },
        sessionClient!
      );
      if (
        (res as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res as any)?.hash) {
        setIndexer?.("Mirror Indexing");
      } else {
        setNotification?.("Something went wrong :( Try again?");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionsLoading({
      ...interactionsLoading,
      mirror: false,
    });
  };

  const handleQuote = async () => {
    if (!commentQuote) return;
    setPostLoading(true);
    try {
      let focus = MainContentFocus.TextOnly;
      let schema = "https://json-schemas.lens.dev/posts/text/3.0.0.json";
      let image = {};
      if (gifOpen?.id == commentQuote) {
        focus = MainContentFocus.Image;
        schema = "https://json-schemas.lens.dev/posts/image/3.0.0.json";
        image = {
          type: "image/png",
          item: gifOpen?.gif,
        };
      }

      const { uri } = await storageClient.uploadAsJson({
        $schema: schema,
        lens: {
          mainContentFocus: focus,
          title: content?.slice(0, 10),
          content: content,
          id: uuidv4(),
          locale: "en",
          ...image,
          tags: ["dialtone"],
        },
      });

      const res = await createPost(
        {
          contentUri: uri,
          quoteOf: {
            post: id,
          },
        },
        sessionClient!
      );

      if (
        (res as any)?.reason?.includes(
          "Signless experience is unavailable for this operation. You can continue by signing the sponsored request."
        )
      ) {
        setSignless?.(true);
      } else if ((res as any)?.hash) {
        setContent("");
        setCommentQuote(undefined);
        setIndexer?.("Quote Indexing");
      } else {
        setNotification?.("Something went wrong :( Try again?");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  return {
    postLoading,
    handleComment,
    interactionsLoading,
    handleLike,
    handleMirror,
    handleQuote,
    commentQuote,
    setCommentQuote,
    content,
    setContent,
  };
};

export default useReactions;
