import "@styles/global.css"
import Provider from '@components/Provider'
import { Toaster } from "react-hot-toast"
import { connectToDB } from '@utils/database';

export const metadata = {
    title: "Shop-It | Admin Portal",
}

const RootLayout = ({ children }) => {

    return (
        <html lang="en">
            <body>
                <Provider>
                    <div>
                        <Toaster
                            position="top-right"
                            reverseOrder={false}
                        />
                        {children}
                    </div>
                </Provider>
            </body>
        </html>
    )
}

export default RootLayout