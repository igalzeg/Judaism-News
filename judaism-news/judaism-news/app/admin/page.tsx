'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        content: '',
        imageUrl: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">פרסום כתבה חדשה</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">כותרת</label>
                    <input
                        type="text"
                        required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">תקציר</label>
                    <textarea
                        required
                        rows={3}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500"
                        value={formData.summary}
                        onChange={e => setFormData({ ...formData, summary: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">תוכן הכתבה</label>
                    <textarea
                        required
                        rows={10}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500"
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">קישור לתמונה</label>
                    <input
                        type="url"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500"
                        value={formData.imageUrl}
                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 disabled:opacity-50"
                >
                    {loading ? 'מפרסם...' : 'פרסם כתבה'}
                </button>
            </form>
        </div>
    );
}
