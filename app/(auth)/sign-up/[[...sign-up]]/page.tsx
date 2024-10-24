import { SignUp } from "@clerk/nextjs";

/**
 * in order to use sign-up of clerk, create a file inside a folder like [[...sign-up]]
 *
 * also specify the route of where we want to go after sign in or sign out
 */

export default function Page() {
  return <SignUp />;
}
