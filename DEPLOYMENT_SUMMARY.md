# Universal Deployment Guide (Server-Agnostic)

Your project is now **Server-Agnostic**. This means you can upload it to any web server, root domain, or subfolder without making any configuration changes.

### How to Deploy Anywhere (Hostinger, GitHub, Vercel, etc.)

1. **Build the Project**:
2.    - Open your terminal in the project root directory.
      -    - Run: `npm run build`.
           -    - This creates a **`dist`** folder.
            
                - 2. **Upload the Files**:
                  3.    - **Upload everything** inside the `dist` folder to your server (e.g., `public_html` on Hostinger).
                        -    - It does not matter if it's in the root folder or a subfolder (like `/typingweb/`). It will work automatically.
                         
                             - 3. **Why this works**:
                               4.    - **Relative Assets**: Every image and script uses `./` so they always find their way home.
                                     -    - **Hash Routing**: I've switched the app to use `HashRouter`. This means the URL will look like `domain.com/#/profile`. This is the most compatible way to browse because it works on **any** server without needing special "rewrite" or ".htaccess" rules.
                                          - ---
                                          
