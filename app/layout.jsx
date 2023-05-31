import "@styles/global.css"
import Provider from '@components/Provider'

export const metadata = {
    title: "Shop-It | Admin Portal",
}

const RootLayout = ({ children }) => {

    return (
        <html lang="en">
            <body>
                <Provider>
                    <div>{children}</div>
                </Provider>
            </body>
        </html>
    )
}

export default RootLayout