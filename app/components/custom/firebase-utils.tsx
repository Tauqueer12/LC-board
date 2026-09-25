import {auth, db} from "./firebase-auth"
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {Dispatch, SetStateAction} from 'react';
import {collection, doc, setDoc, getDoc, getDocs} from 'firebase/firestore/lite';


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
    } catch (e) {
        console.error('Unsuccessful', e);
    }
}

export async function getBoardData(user: string, pid: string) {
    try {
        const docRef = doc(db, user, pid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (e) {
        console.error("Error fetching board data:", e);
        return null;
    }
}

export async function getUserData(user: string) {
    try {
        const docRef = collection(db, user);
        const docSnaps = await getDocs(docRef);

        return docSnaps.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (e) {
        console.error("Error fetching user data:", e);
        return [];
    }
}
