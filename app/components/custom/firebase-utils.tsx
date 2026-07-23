import {auth, db} from "./firebase-auth"
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {Dispatch, SetStateAction} from 'react';
import {collection, doc, setDoc} from 'firebase/firestore/lite';
import {getDoc, getDocs} from '@firebase/firestore';


export function signout(setUserState: Dispatch<SetStateAction<string>>) {
    signOut(auth).then(() => {
        console.log("logged out");
        // Sign-out successful.
        setUserState("Login");
    })
}

export function checkUserState(setUserState: Dispatch<SetStateAction<string>>) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("changed to signout")
            setUserState("Signout");
        } else {
            console.log("not signed in")
        }
    });
}

export async function signupUser(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
}

export async function loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}

export async function setBoardData(user: string, pid: string, content: string, sceneVersion: number) {
    try {
        await setDoc(doc(db, user, pid), {
            content: content,
            sceneVersion: sceneVersion
        });
        console.log("task successfully completed");
    } catch (e) {
        console.error('Unsuccessful', e);
    }
}

export async function getBoardData(user: string, pid: string) {
    const docRef = doc(db, user, pid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}

export async function getUserData(user: string) {
    console.log("fetching started :", user);
    const docRef = collection(db, user);
    const docSnaps = await getDocs(docRef);

    const events = docSnaps.docs.map((doc: any) => doc.data())
    console.log(events);
}
