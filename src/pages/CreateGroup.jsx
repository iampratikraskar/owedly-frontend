import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import groupService from "../services/groupService";

function CreateGroup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!formData.name.trim()) {
            setError("Group name is required.");
            return;
        }

        try {

            setLoading(true);

            await groupService.createGroup({
                name: formData.name.trim(),
                description: formData.description.trim() || null,
            });

            navigate("/groups");

        } catch (error) {

            console.error(
                "Create group failed:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to create group. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl">

            {/* Back */}

            <Link
                to="/groups"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft size={18} />
                Back to Groups
            </Link>


            {/* Header */}

            <div className="mt-6">

                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                    Create a Group
                </h1>

                <p className="mt-2 text-gray-500">
                    Create a group for friends, roommates,
                    trips, or shared expenses.
                </p>

            </div>


            {/* Form Card */}

            <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* Group Name */}

                    <div>

                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Group Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Goa Trip"
                            maxLength={100}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                        <p className="mt-2 text-xs text-gray-500">
                            Give your group a clear and recognizable name.
                        </p>

                    </div>


                    {/* Description */}

                    <div>

                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Description
                            <span className="ml-1 font-normal text-gray-400">
                                (Optional)
                            </span>
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="What is this group for?"
                            maxLength={500}
                            rows={4}
                            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                        <div className="mt-2 flex justify-end">
                            <span className="text-xs text-gray-400">
                                {formData.description.length}/500
                            </span>
                        </div>

                    </div>


                    {/* Actions */}

                    <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

                        <Link
                            to="/groups"
                            className="rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            <Plus size={18} />

                            {loading
                                ? "Creating..."
                                : "Create Group"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CreateGroup;