import {Excalidraw, MainMenu, serializeAsJSON, WelcomeScreen, getSceneVersion} from "@excalidraw/excalidraw"
import {ExcalidrawElement} from "@excalidraw/excalidraw/types/element/types"
import {AppState, BinaryFiles} from "@excalidraw/excalidraw/types/types"
import {useState, useEffect, useRef} from "react"
import {onAuthStateChanged} from "firebase/auth"
import {auth} from "./firebase-auth"
import {getBoardData, setBoardData} from "./firebase-utils"

const ExcalidrawWrapper: React.FC<{ probID: string | string[] }> = ({probID}) => {
    const [initialData, setInitialData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const sceneVersion = useRef(0);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            const probIdStr = probID.toString();
            if (user && user.email) {
                setUserEmail(user.email);
                // Load from Firestore
                const data = await getBoardData(user.email, probIdStr);
                if (isMounted.current) {
                    if (data && data.content) {
                        setInitialData(JSON.parse(data.content));
                        if (data.sceneVersion) sceneVersion.current = data.sceneVersion;
                    } else {
                        // Fallback to local storage if Firestore is empty for this problem
                        const localContent = localStorage.getItem(`excalidraw-${probIdStr}`);
                        if (localContent) setInitialData(JSON.parse(localContent));
                    }
                    setIsLoading(false);
                }
            } else {
                setUserEmail(null);
                // Load from local storage for guests
                if (isMounted.current) {
                    const localContent = localStorage.getItem(`excalidraw-${probIdStr}`);
                    if (localContent) {
                        setInitialData(JSON.parse(localContent));
                    }
                    setIsLoading(false);
                }
            }
        });

        return () => {
            isMounted.current = false;
            unsubscribe();
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [probID]);


    const onchange = (elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
        const currentVersion = getSceneVersion(elements);
        if (currentVersion !== sceneVersion.current) {
            sceneVersion.current = currentVersion;
            const probIdStr = probID.toString();
            const content = serializeAsJSON(elements, appState, files, "local");
            
            // Always save to local storage as fallback/guest
            localStorage.setItem(`excalidraw-${probIdStr}`, content);

            // Debounced save to Firestore (1 second delay after drawing stops)
            if (userEmail) {
                if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
                debounceTimeout.current = setTimeout(() => {
                    setBoardData(userEmail, probIdStr, content, currentVersion);
                }, 1000);
            }
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 animate-pulse font-medium">Loading whiteboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full">
            <Excalidraw onChange={onchange} initialData={initialData}>
                <WelcomeScreen>
                    <WelcomeScreen.Center>
                        <WelcomeScreen.Hints.ToolbarHint>
                            <p> ToolBar Hints </p>
                        </WelcomeScreen.Hints.ToolbarHint>
                        <WelcomeScreen.Hints.MenuHint/>
                        <WelcomeScreen.Hints.HelpHint/>
                        <WelcomeScreen.Center.Heading>
                            Welcome to LC-Board !!
                        </WelcomeScreen.Center.Heading>
                    </WelcomeScreen.Center>
                </WelcomeScreen>
                <MainMenu>
                    <MainMenu.DefaultItems.LoadScene/>
                    <MainMenu.DefaultItems.Export/>
                    <MainMenu.DefaultItems.SaveAsImage/>
                    <MainMenu.DefaultItems.ClearCanvas/>
                    <MainMenu.DefaultItems.ChangeCanvasBackground/>
                    <MainMenu.DefaultItems.Help/>
                </MainMenu>
            </Excalidraw>
        </div>
    )
}
export default ExcalidrawWrapper