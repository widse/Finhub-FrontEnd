import { User } from "@/model/User";
import { recoilPersist } from "recoil-persist";
import { AtomEffect, atom, useSetRecoilState } from "recoil";

/** persist nextjs config */
export const ssrCompletedState = atom({
  key: "SsrCompleted",
  default: false,
});

export const useSsrComplectedState = () => {
  const setSsrCompleted = useSetRecoilState(ssrCompletedState);
  return () => setSsrCompleted(true);
};

const { persistAtom } = recoilPersist();

export const persistAtomEffect = <T>(param: Parameters<AtomEffect<T>>[0]) => {
  param.getPromise(ssrCompletedState).then(() => persistAtom(param));
};

export const userState = atom<User>({
    key: `userState`, 
    default: {
        name: "",
        email: "",
        nickname: "",
        avatarUrl: "",
        userType: "",
        userTypeUrl: "",
        pushYN: false,
    },
    effects_UNSTABLE: [persistAtomEffect],
  });