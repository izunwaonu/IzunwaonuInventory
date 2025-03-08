import React, { useState, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { Plus, X } from "lucide-react";

interface TagInputProps {
  /** Initial tags as a comma-separated string */
  initialValue?: string;
  /** Callback function that receives the updated tags as a comma-separated string */
  onChange?: (value: string) => void;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Maximum number of tags allowed (optional) */
  maxTags?: number;
  /** Maximum length of each tag (optional) */
  maxTagLength?: number;
  /** Disable the input (optional) */
  disabled?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({
  initialValue = "",
  onChange,
  placeholder = "Add tags...",
  className = "",
  maxTags,
  maxTagLength,
  disabled = false,
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Initialize tags from comma-separated string
  useEffect(() => {
    if (initialValue) {
      const initialTags = initialValue
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      setTags(initialTags);
    }
  }, [initialValue]);

  // Convert tags array to comma-separated string and call onChange
  useEffect(() => {
    const tagsString = tags.join(", ");
    onChange?.(tagsString);
  }, [tags, onChange]);

  const validateTag = (tag: string): boolean => {
    if (!tag.trim()) {
      setError("Tag cannot be empty");
      return false;
    }

    if (maxTagLength && tag.length > maxTagLength) {
      setError(`Tag must be ${maxTagLength} characters or less`);
      return false;
    }

    if (maxTags && tags.length >= maxTags) {
      setError(`Maximum ${maxTags} tags allowed`);
      return false;
    }

    if (tags.includes(tag.trim())) {
      setError("Tag already exists");
      return false;
    }

    setError(null);
    return true;
  };

  const addTag = (): void => {
    const trimmedValue = inputValue.trim();
    if (validateTag(trimmedValue)) {
      setTags((prev) => [...prev, trimmedValue]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string): void => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    setError(null);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
    setError(null);
  };

  return (
    <div className={`w-full space-y-2 ${className}`}>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-label="Tag input"
          aria-invalid={!!error}
          aria-describedby={error ? "tag-input-error" : undefined}
        />
        <button
          type="button"
          onClick={addTag}
          disabled={disabled || !inputValue.trim()}
          className="p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="Add tag"
        >
          <Plus size={20} />
        </button>
      </div>

      {error && (
        <p id="tag-input-error" className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2" role="list" aria-label="Tags">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 rounded-full"
            role="listitem"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              disabled={disabled}
              className="p-1 rounded-full hover:bg-gray-200 focus:outline-none disabled:cursor-not-allowed"
              aria-label={`Remove ${tag} tag`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
