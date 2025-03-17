import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/querify.png" />
      </head>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
