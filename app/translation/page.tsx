"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { fetchFunction } from "../lib/fetch-functions";
import { convertTranslationsToTextFile } from "../lib/files-functions";

export default function TranslationPage() {
  const searchParams = useSearchParams();
  const translationFormRef = useRef<any>(null);
  const [translations, settranslations] = useState([]);

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

    await getFileSentences().then((data: any) => {
      settranslations(data);
    });
    alert("Translations saved successfully!");
  }

  if (!translations.length) {
    return (
      <div className="max-w-4xl mx-4 md:mx-auto px-8 mb-16 py-16">
        No text file selected for translation!
      </div>
    );
  }
  return (
    <main className="max-w-4xl mx-4 md:mx-auto px-8 mb-16">
      <form
        onSubmit={exportTranslations}
        ref={translationFormRef}
        className=""
      >
        <div className="flex flex-row justify-between items-center sticky top-8 bg-orange-50">
          <p className="text-xl py-8">Translate</p>
          <div className="flex gap-2">
            <button
              onClick={onSaveTranslations}
              type="button"
              className="bg-gray-600 px-2 py-1 text-white"
            >
              Save
            </button>
            <button type="submit" className="bg-blue-500 px-2 py-1 text-white">
              Export
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-16">
          {translations.map((row: any) => {
            return (
              <div
                key={row.id}
                className="flex flex-col md:flex-row w-full gap-2"
              >
                <div className="flex-1">{row.sentence}</div>
                <textarea
                  className="translation-input flex-1  border outline-blue-300 p-2 w-full"
                  id={row.id}
                  placeholder="Type translations here"
                  defaultValue={row.translation}
                />
              </div>
            );
          })}
        </div>
      </form>
    </main>
  );
}
