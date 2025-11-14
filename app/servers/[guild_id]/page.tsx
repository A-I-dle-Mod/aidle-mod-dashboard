'use client';

import { use, useEffect, useState } from 'react';
import { useUser } from '@/components/user/user-context';
import { UserContextType } from "@/lib/types/user-type";
import { ServerResponse, Message, Settings } from '@/lib/types/server-type';
import request from '@/lib/http/request';

type TestSettings = {
  test_string: string
};

type TestResult = {
  label: string
  probability: number
};

type TestResults = {
  results: TestResult[],
  moderate: boolean,
  moderation_message: string
  total_probability: number
};

export default function ServerDetails({
  params,
}: {
  params: Promise<{ guild_id: string }>
}) {
  const { guild_id } = use(params);
  const [user, setUser] = useState<UserContextType | null>(null);
  const [server, setServer] = useState<ServerResponse | null>(null);
  const [unsaved, setUnsaved] = useState<boolean>(false);
  const [settingsItems, setSettingsItems] = useState<Settings | null>(null)
  const [testSettings, setTestSettings] = useState<TestSettings | null>(null);
  const [disableTestButton, setDisableTestButton] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null)

  useUser().then(resp => setUser(resp));

  useEffect(() => {
    async function fetchServerInfo() {
      try {
        if (user !== null) {
          // Fetch the list of servers for the user too
          const serversResponse = await request(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/guilds/${guild_id}`);

          if (typeof serversResponse !== 'undefined' && serversResponse.ok) {
            const serversData = await serversResponse.json();
            setServer(serversData);

            setSettingsItems(serversData.guild.settings);
          } else {
            console.error('Failed to fetch user servers');
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
    fetchServerInfo();
  }, [user, guild_id]);

  const getLabelForSetting = (id: string) => {
    switch (id) {
      case 'enable_h':
        return 'Hate';
      case 'enable_h2':
        return 'Hate/Threatening';
      case 'enable_hr':
        return 'Harassment';
      case 'enable_s':
        return 'Sexual Content';
      case 'enable_s3':
        return 'Sexual Content (Minors)';
      case 'enable_sh':
        return 'Self-Harm';
      case 'enable_v':
        return 'Violence';
      case 'enable_v2':
        return 'Graphic Violence';
      default: 
        return 'Undefined';
    }
  }

  const getDescriptionForSetting = (id: string) => {
    switch (id) {
      case 'enable_h':
        return 'Content that expresses, incites, or promotes hate based on race, gender, ethnicity, religion, nationality, sexual orientation, disability status, or caste.';
      case 'enable_h2':
        return 'Hateful content that also includes violence or serious harm towards the targeted group.';
      case 'enable_hr':
        return 'Content that may be used to torment or annoy individuals in real life, or make harassment more likely to occur.';
      case 'enable_s':
        return 'Content meant to arouse sexual excitement, such as the description of sexual activity, or that promotes sexual services (excluding sex education and wellness).';
      case 'enable_s3':
        return 'Sexual content that includes an individual who is under 18 years old.';
      case 'enable_sh':
        return 'Content that promotes, encourages, or depicts acts of self-harm, such as suicide, cutting, and eating disorders.';
      case 'enable_v':
        return 'Content that promotes or glorifies violence or celebrates the suffering or humiliation of others.';
      case 'enable_v2':
        return 'Violent content that depicts death, violence, or serious physical injury in extreme graphic detail.';
      default: 
        return 'Undefined';
    }
  }

  const handleChange = (id: string) => {
    if (settingsItems === null) {
      return;
    }

    const settingKey = id as keyof typeof settingsItems;

    setSettingsItems({
      ...settingsItems,
      [settingKey]: !settingsItems[settingKey]
    });

    setUnsaved(true);
  };

  const handleConfidenceChange = (confidence: string) => {
    const confidenceKey = 'confidence_limit' as keyof typeof settingsItems;

    setSettingsItems({
      ...settingsItems,
      [confidenceKey]: parseInt(confidence, 10),
    });

    setUnsaved(true);
  };

  const handleModerationMessageChange = (message: string) => {
    const moderationMessageKey = 'moderation_message' as keyof typeof settingsItems;

    setSettingsItems({
      ...settingsItems,
      [moderationMessageKey]: message,
    });

    setUnsaved(true);
  }

  const handleSave = async () => {
    const bareSettings = Object.assign({}, settingsItems);
    const response = await request(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/guild/${guild_id}/settings`, 'POST', bareSettings);

    if (response.ok) {
      setUnsaved(false);
    }
  };

  const runTest = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setDisableTestButton(true);

    const response = await request(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/test?test_string=${testSettings?.test_string}&guild_id=${server?.guild.guild_id}`);
    setDisableTestButton(false);
    
    setTestResults(await response.json());
  };

  return (
    <>
      <header>
        <h2 className="text-xl font-semibold mb-4">{server?.guild.guild_name}</h2>
      </header>
      <div>
        <form className="w-full mx-auto p-6 m-6 bg-white rounded-md shadow">
          <h3 className="text-xl font-semibold mb-4">Server Settings</h3>
          <p className="m-4">Choose the types of content A.I.dle Mod should Moderate</p>

          <div className="grid grid-cols-2 gap-2">
            {settingsItems !== null && Object.keys(settingsItems).map((item: string) => {
              if (item.indexOf('enable_') === -1) {
                return null;
              }

              const settingKey = item as keyof typeof settingsItems;

              if (typeof settingsItems[settingKey] !== 'boolean') {
                return null;
              }

              const details: boolean = settingsItems[settingKey];

              return (
                <label key={item} className="flex items-start space-x-2 p-2 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    id={item}
                    type="checkbox"
                    checked={details}
                    onChange={() => handleChange(item)}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div>
                    <p className="font-medium">{getLabelForSetting(item)}</p>
                    <p className="text-sm text-gray-500">{getDescriptionForSetting(item)}</p>
                  </div>
                </label>
              );
            })}

            {settingsItems !== null && (
              <label className="flex flex-wrap items-start space-x-2 p-2 rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  id="confidence_limit"
                  type="range"
                  min={0}
                  max={100}
                  value={settingsItems?.confidence_limit}
                  onChange={e => handleConfidenceChange(e.target.value)}
                  className="mt-1 rounded border-gray-300 w-full"
                />
                <div>
                  <p className="font-medium w-full">Confidence Value ({settingsItems?.confidence_limit}%)</p>
                  <p className="text-sm text-gray-500">The minimum confidence (score) a message needs to be auto-moderated</p>
                </div>
              </label>
            )}

            {settingsItems !== null && (
              <label className="flex flex-wrap items-start space-x-2 p-2 rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  id="moderation_message"
                  value={settingsItems?.moderation_message}
                  onChange={e => handleModerationMessageChange(e.target.value)}
                  className="mt-1 w-full rounded border-gray-300 border p-2"
                />
                <div className="w-full">
                  <p className="font-medium">Moderation message</p>
                  <p className="text-sm text-gray-500">Shown to a user when one of their messages is auto moderated.</p>
                </div>
              </label>
            )}
          </div>
        </form>

        {settingsItems !== null && (
          <form className="w-full mx-auto p-6 m-6 bg-white rounded-md shadow">
            <h3 className="text-xl font-semibold mb-4">Test Server Settings</h3>
            <p className="m-4">Does not count towards your daily message quota.</p>

            {testResults !== null && (
              <>
                <ul className="pl-8 pr-8 list-disc">
                  {testResults.results.map((result: TestResult) => {
                    const settingKey = `enable_${result.label.toLowerCase()}` as keyof typeof settingsItems;

                    if (settingsItems[settingKey] === false || result.label.toLowerCase() === 'ok') {
                      return null;
                    }

                    return (
                      <li key={result.label}>{getLabelForSetting(`enable_${result.label.toLowerCase()}`)}: {(result.probability * 100).toFixed(2)}%</li>
                    );
                  })}
                </ul>
                <p className="m-4">Total probability: {(testResults.total_probability * 100).toFixed(2)}%</p>
                <p className="m-4">Message {testResults.moderate ? 'would be moderated' : 'would not be moderated'}</p>
              </>
            )}

            <div className="flex">
              <label className="w-5/6 flex flex-wrap items-start space-x-2 p-2 rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  id="moderation_message"
                  value={testSettings?.test_string}
                  onChange={e => setTestSettings({test_string: e.target.value})}
                  className="mt-1 w-full rounded border-gray-300 border p-2"
                />
                <div className="w-full">
                  <p className="font-medium">Test message</p>
                </div>
              </label>

              <button
                onClick={(e) => runTest(e)}
                disabled={disableTestButton}
                className="px-3 py-1 rounded-md w-1/12 h-1/6 m-4 font-semibold shadow text-white bg-slate-500"
              >
                Test
              </button>
            </div>
          </form>
        )}

        {unsaved && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-200 text-black px-6 py-3 rounded-md shadow-lg flex items-center space-x-3">
            <span>You have unsaved changes</span>
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded-md font-semibold shadow text-white bg-slate-500"
            >
              Save
            </button>
          </div>
        )}
      </div>
      <table className="min-w-full text-left text-sm/6 text-zinc-950 dark:text-white mt-8">
        <caption className="caption-top text-slate-500">
          Scores represent harmful language detected, lower scores mean less harmful language.
        </caption>
        <thead>
          <tr className="border-b border-b-zinc-950/10">
            <th className="p-2">Message Sent</th>
            <th className="p-2">Author</th>
            <th className="p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {server?.guild.messages?.map((message: Message) => {
            return (
              <tr key={message.id} className="border-b border-b-zinc-950/10">
                <td className="flex p-2">
                  {new Date(message.created_date).toLocaleString()}
                </td>
                <td className="p-2">
                  {message.author_name}
                </td>
                <td className="p-2">
                  {(message.score * 100).toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}