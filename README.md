# Terry Wildlife Photography Portfolio

A modern, elegant photography portfolio website built with Next.js and Vercel Blob storage. Features a clean gallery layout, protected upload portal, and metadata management personalised for Terry Wildlife Photography.

## Features

- 🖼️ **Masonry Gallery** - Pinterest-style photo grid with modal lightbox
- 📱 **Responsive Design** - Mobile-first, works beautifully on all devices
- 🔐 **Secret Upload Portal** - URL-gated admin access (no visible login)
- ✏️ **Image Metadata** - Title and description for each photo
- 🗑️ **Full Management** - Upload, edit, and delete images
- 🚀 **Fast & Free** - Vercel Blob storage, no database needed
- 🎨 **Photographer-First UI** - Warm stone tones, serif typography

## Tech Stack

- **Framework**: Next.js 16 (Pages Router)
- **Storage**: Vercel Blob
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Language**: TypeScript


### Public Gallery

Visit `https://terryswildlife.vercel.app/` to view all published photos with titles and descriptions. Click any image to open full-screen modal.

### Upload Portal

**Features:**
- Upload multiple images at once
- Add title and description per image
- Duplicate detection (prevents re-uploading same file)
- Manage existing images (edit/delete)

**Important:** 
- Bookmark the upload URL with your secret key
- Never share this URL publicly
- No visible login or upload button on public site

### How Metadata Works

Image metadata (title/description) is encoded directly into the Blob filename using Base64:
hash__base64Title__base64Description.jpg

This approach is:
- ✅ Completely free (no database needed)
- ✅ Metadata always travels with the image
- ✅ Works with Vercel Blob's limitations
- ✅ No external dependencies

## Credits

- **Photography**: Terry Machana
- **Development**: Alex Marumo
- **Framework**: Next.js by Vercel

## License

MIT License - built by Alex Marumo for Terry Wildlife Photography
