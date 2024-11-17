"use client";

import { useRouter } from "next/navigation";
import { fileUpload } from "./lib/fetch-functions";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [fileData, setfileData] = useState<any>();

  // useEffect(() => {
  //   return () => {
  //     alert("closing");
  //   };
  // }, []);

  async function onFileSubmit(event: any) {
    event.preventDefault();
    // const file = event.target.elements["text-file"].files[0];

    // console.log("onFileSubjit: ", event.target.elements["text-file"].files[0]);
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
    <main className="max-w-4xl mx-auto max-h-screen my-8">
      <form onSubmit={onFileSubmit} className="flex flex-col gap-2">
        <div className="bg-gray-200 p-8 flex flex-row items-center">
          <input
            type="file"
            accept=".txt"
            onChange={(event: any) => {
              let textFile = event.target?.files[0];
              if (!textFile) {
                alert("File selection Failed!");
                return;
              }
              console.log("textFile:", textFile);
              setfileData(textFile);
            }}
          />
          <div className="flex flex-col">
            {fileData && (
              <>
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
