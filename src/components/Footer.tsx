import * as React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-center py-6 mt-10 rounded-t-lg">
      <div>BikiNinjas Blog &copy; {new Date().getFullYear()} &ndash; Powered by Next.js &amp; Markdown</div>
    </footer>
  );
}
