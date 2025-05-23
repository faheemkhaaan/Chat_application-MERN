import { createPortal } from 'react-dom';
import { MdClose } from 'react-icons/md';
import { IoIosSend } from 'react-icons/io';
import { FiTrash2 } from 'react-icons/fi';

interface ImagesPreviewProps {
    selectedImages: File[];
    onClearImages?: () => void;
    onClearImage?: (index: number) => void;
    onSendImages: () => void;
}

function ImagesPreview({ selectedImages, onClearImage, onSendImages, onClearImages }: ImagesPreviewProps) {
    if (!selectedImages || selectedImages.length === 0) return null;

    const handleRemoveImage = (index: number) => {
        if (!onClearImage) return;
        onClearImage(index);
    }

    return createPortal(
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 p-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {selectedImages.length} Image{selectedImages.length > 1 ? 's' : ''} Selected
                    </h3>
                    <button
                        onClick={onClearImages}
                        className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                        <FiTrash2 size={16} />
                        Clear All
                    </button>
                </div>

                {/* Images Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedImages.map((image, index) => (
                            <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 text-red-500 hover:text-red-700"
                                    aria-label="Remove image"
                                >
                                    <MdClose size={18} />
                                </button>
                                <div className="aspect-square flex items-center justify-center">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                                    />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                    <p className="text-white text-xs truncate">
                                        {image.name}
                                    </p>
                                    <p className="text-white/80 text-xs">
                                        {(image.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        {selectedImages.length} file{selectedImages.length > 1 ? 's' : ''} selected
                    </span>
                    <button
                        onClick={onSendImages}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        aria-label="Send images"
                    >
                        <IoIosSend size={20} />
                        Send {selectedImages.length > 1 ? 'All' : ''}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ImagesPreview;