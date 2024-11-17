"use client";

import { useRouter } from "next/navigation";
import { fileUpload } from "./lib/fetch-functions";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [fileData, setfileData] = useState<any>();

  async function onFileSubmit(event: any) {
    event.preventDefault();

    const data = await uploadFile(fileData);

    if (!data) return;
    console.log(data);
    router.push(`/translation?fileId=${data.fileId}`);
  }

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const { data, error } = await fileUpload({
      method: "POST",
      path: "/upload",
      body: formData,
    });

    if (error) {
      console.log("Upload file failed", error);
      return;
    }

    return data;
  }

  return (
    <main className="max-w-4xl my-8 mx-4 md:mx-auto max-h-screen ">
      <form onSubmit={onFileSubmit} className="flex flex-col gap-2">
        <div className="bg-gray-200 p-8 flex flex-col md:flex-row md:items-center gap-4">
          <input
            className="flex-1 px-2 py-4 border border-dashed border-gray-100 hover:cursor-pointer"
            type="file"
            accept=".txt"
            onChange={(event: any) => {
              if (!event.target?.files.length) {
                setfileData(undefined);
                return;
              }

              setfileData(event.target?.files[0]);
            }}
          />
          <div className="flex flex-col flex-1">
            {fileData && (
              <>
                <p className="italic py-2">File Details:</p>
                <p>{fileData.name}</p>
                <p>{fileData.type}</p>
                <p>{fileData.size / 1000} KB</p>
              </>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={!fileData}
          className="bg-blue-500 p-2 text-white disabled:bg-gray-500"
        >
          Start Translation
        </button>
      </form>
    </main>
  );
}
