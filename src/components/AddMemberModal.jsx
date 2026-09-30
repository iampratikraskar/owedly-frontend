import { useState } from "react";
import { UserPlus, X } from "lucide-react";

import groupService from "../services/groupService";

function AddMemberModal({
    groupId,
    onClose,
    onMemberAdded,
}) {

    const [userId, setUserId] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        const parsedUserId = Number(userId);

        if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {

            setError("Please enter a valid user ID.");

            return;
        }

        try {

            setLoading(true);

            const updatedGroup =
                await groupService.addMember(
                    groupId,
                    parsedUserId
                );

            onMemberAdded(updatedGroup);

            onClose();

        } catch (error) {

            console.error(
                "Adding member failed:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to add member."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4">

            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

                    <div className="flex items-center gap-3">

                        <div className="rounded-lg bg-indigo-50 p-2.5">
                            <UserPlus
                                size={20}
                                className="text-indigo-600"
                            />
                        </div>

                        <div>

                            <h2 className="font-semibold text-gray-900">
                                Add Member
                            </h2>

                            <p className="text-xs text-gray-500">
                                Add someone to this group
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* Body */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-6"
                >

                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div>

                        <label
                            htmlFor="userId"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            User ID
                        </label>

                        <input
                            id="userId"
                            type="number"
                            min="1"
                            value={userId}
                            onChange={(event) =>
                                setUserId(event.target.value)
                            }
                            placeholder="e.g. 2"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                        <p className="mt-2 text-xs text-gray-500">
                            Enter the ID of the registered Owedly user.
                        </p>

                    </div>


                    {/* Actions */}

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            <UserPlus size={17} />

                            {loading
                                ? "Adding..."
                                : "Add Member"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddMemberModal;