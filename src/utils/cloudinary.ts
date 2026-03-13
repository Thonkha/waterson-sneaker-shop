export const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'waterson_preset'); // User needs to create this in Cloudinary

    const res = await fetch(`https://api.cloudinary.com/v1_1/dripstore-cloud/image/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        throw new Error('Upload failed');
    }

    const data = await res.json();
    return data.secure_url;
};
