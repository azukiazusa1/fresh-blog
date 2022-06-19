/** @jsx h */
import { h, useState } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface Props {
  initialValue?: string;
}

export default function ContentForm({ initialValue = "" }: Props) {
  const [value, setValue] = useState(initialValue);
  const [preview, setPreview] = useState(false);

  const parse = (content: string) => {
    const parsed = marked(content);
    const purified = DOMPurify.sanitize(parsed);
    return purified;
  };

  const handleChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    setValue(target.value);
  };
  return (
    <div>
      <div class={tw("flex justify-between")}>
        <label class={tw("text-gray-500 text-sm")} htmlFor="content">
          Content
        </label>
        <label class={tw("text-gray-500 text-sm")}>
          Preview
          <input
            type="checkbox"
            id="preview"
            class={tw("ml-2")}
            checked={preview}
            onChange={() => setPreview((prev) => !prev)}
          />
        </label>
      </div>
      {preview ? (
        <div
          id="contents"
          dangerouslySetInnerHTML={{
            __html: parse(value),
          }}
        />
      ) : (
        <textarea
          id="content"
          rows={10}
          class={tw("w-full p-2 border border-gray-300 rounded-md")}
          name="content"
          value={value}
          onChange={handleChange}
        />
      )}
    </div>
  );
}
