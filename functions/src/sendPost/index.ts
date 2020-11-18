import { EventContext } from "firebase-functions/lib";
import { QueryDocumentSnapshot } from "firebase-functions/lib/providers/firestore";

async function sendPost(
  snapshot: QueryDocumentSnapshot,
  context: EventContext
): Promise<any> {
  console.log("~~~ sendPost ~~~");
  const wallPost = snapshot.data();
  console.log(wallPost);
}

export default sendPost;
