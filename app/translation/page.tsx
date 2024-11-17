"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { fetchFunction } from "../lib/fetch-functions";
import { convertTranslationsToTextFile } from "../lib/files-functions";

export default function TranslationPage() {
  const searchParams = useSearchParams();
  const translationFormRef = useRef<any>(null);
  const [translations, settranslations] = useState([]);
  const search = searchParams.get("fileId");

  useEffect(() => {
    getFileSentences().then((data: any) => {
      settranslations(data);
    });
  }, []);

  async function getFileSentences() {
    console.log(searchParams.get("fileId"));
    return await fetchFunction({
      path: `/files/${searchParams.get("fileId")}/sentences`,
      method: "GET",
    }).then(({ data }) => data).catch(({ error }) => {
      console.error(error);
    });
  }

  function getChangedInputValues({ orginalData, inputValues }: any) {
    let updatedTranslations = [];

    for (let row of inputValues) {
      let { id, translation } = orginalData.find((d: any) => d.id == row.id);

      if (translation != row.value) {
        updatedTranslations.push({ id, translation: row.value });
      }
    }

    return updatedTranslations;
  }

  function getAllTranslations({ orginalData, inputValues }: any) {
    let allTranslations = [];

    for (let row of inputValues) {
      let { translation, sentence } = orginalData.find((d: any) =>
        d.id == row.id
      );

      allTranslations.push({ sentence, translation: row.value });
    }

    return allTranslations;
  }

  async function exportTranslations(event: any) {
    event.preventDefault();

    const allTranslations = getAllTranslations({
      orginalData: translations,
      inputValues: event.target.querySelectorAll(".translation-input"),
    });

    console.log({ allTranslations });

    await convertTranslationsToTextFile(allTranslations);
  }

  async function onSaveTranslations(event: any) {
    const updatedTranslations = getChangedInputValues({
      orginalData: translations,
      inputValues: translationFormRef.current.querySelectorAll(
        ".translation-input",
      ),
    });

    console.log("updatedData :", updatedTranslations);
    if (!updatedTranslations.length) return;

    const { error } = await fetchFunction({
      path: "/sentences",
      method: "POST",
      body: JSON.stringify(updatedTranslations),
    });

    if (error) {
      console.log("updated error", error);
      return;
    }

    const data = await getFileSentences();

    console.log("get sentences", { data });
  }

  return (
    <main className="max-w-6xl mx-auto px-8">
      <form
        onSubmit={exportTranslations}
        ref={translationFormRef}
        className=""
      >
        <div className="flex flex-row-reverse justify-between p-2 sticky top-0 bg-orange-50">
          <button type="submit" className="bg-blue-500 px-2 text-white">
            Export
          </button>
          <button
            onClick={onSaveTranslations}
            type="button"
            className="bg-blue-500 px-2 text-white"
          >
            Save
          </button>
        </div>
        <div className="flex flex-col">
          {translations.map((row: any) => {
            return (
              <p className="flex flex-row w-full p-4">
                <div className="flex-1">{row.sentence}</div>
                <textarea
                  className="translation-input flex-1  border outline-blue-300 p-2 w-full"
                  id={row.id}
                  defaultValue={row.translation}
                />
              </p>
            );
          })}
        </div>
      </form>
    </main>
  );
}
