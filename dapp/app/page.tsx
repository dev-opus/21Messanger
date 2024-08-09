'use client';
import { Card } from '@/app/components/';
import messageBoard from '@/contract/abi.json';
import React, { useEffect, useState } from 'react';
import { Address } from 'viem';

import {
  useReadContract,
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from 'wagmi';

const CONTRACT_OWNER = '0xCD85D97F0260E2de0861a80840A26066A0F061F4';
const CONTRACT_ADDRESS = '0xd03f58B3421EE67f4B765fe5AcfB6032892B8503';

type Message = {
  claps: number;
  timestamp: number;
  message: string;
  creator: Address;
  isSpam: boolean;
  messageId: number;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filterText, setFilterText] = useState('showing all messages');

  const { address: currentAddress } = useAccount();
  const { data: hash, writeContractAsync } = useWriteContract();

  const {
    data,
    error,
    isLoading: messagesLoading,
  } = useReadContract({
    abi: messageBoard.abi,
    address: CONTRACT_ADDRESS,
    functionName: 'get',
  });

  const {
    isPending: pending,
    isSuccess: confirmed,
    isLoading: loading,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    async function composeMessages(rawMessages: any[]) {
      const messages = [];

      for (let i = 0; i < rawMessages.length; i++) {
        const data = {
          claps: Number(rawMessages[i].claps),
          creator: rawMessages[i].creator as Address,
          isSpam: rawMessages[i].isSpam as boolean,
          message: rawMessages[i].text as string,
          messageId: Number(rawMessages[i].messageId),
          timestamp: Number(rawMessages[i].timestamp),
        };

        messages.push(data);
      }

      return messages;
    }

    if (data) {
      composeMessages(data as []).then((messages) => setMessages(messages));
    }
  }, [data]);

  /* Handlers */

  function handleFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    const filter = e.target.value;

    async function composeMessages(rawMessages: any[]) {
      const messages = [];

      for (let i = 0; i < rawMessages.length; i++) {
        const data = {
          claps: Number(rawMessages[i].claps),
          creator: rawMessages[i].creator as Address,
          isSpam: rawMessages[i].isSpam as boolean,
          message: rawMessages[i].text as string,
          messageId: Number(rawMessages[i].messageId),
          timestamp: Number(rawMessages[i].timestamp),
        };

        messages.push(data);
      }

      return messages;
    }

    if (filter === 'all') {
      composeMessages(data as []).then((messages) => setMessages(messages));
      setFilterText('showing all messages');
    }

    if (filter === 'mine') {
      composeMessages(data as []).then((messages) => {
        const messagesToShow = messages.filter(
          (msg: Message) => msg.creator === currentAddress
        );

        setMessages(messagesToShow);
        setFilterText('showing only messages added by you');
      });
    }

    if (filter === 'not-spam') {
      composeMessages(data as []).then((messages) => {
        const messagesToShow = messages.filter(
          (msg: Message) => msg.isSpam === false
        );

        setMessages(messagesToShow);
        setFilterText('showing only non-spam messages');
      });
    }
  }

  async function handleClap(messageId: number) {
    await writeContractAsync({
      abi: messageBoard.abi,
      address: CONTRACT_ADDRESS,
      functionName: 'clap',
      args: [messageId, 1],
    });
  }

  async function handleSpamToggle(
    messageId: number,
    action: 'mark' | 'unmark'
  ) {
    if (currentAddress !== CONTRACT_OWNER) {
      alert('insufficient permissions!!');
      return;
    }

    if (action === 'mark') {
      await writeContractAsync({
        abi: messageBoard.abi,
        address: CONTRACT_ADDRESS,
        functionName: 'markAsSpam',
        args: [messageId],
      });
    }

    if (action === 'unmark') {
      await writeContractAsync({
        abi: messageBoard.abi,
        address: CONTRACT_ADDRESS,
        functionName: 'unMarkAsSpam',
        args: [messageId],
      });
    }
  }

  async function formAction(formData: FormData) {
    try {
      const rawFormData = Object.fromEntries(formData);
      const message = rawFormData.message as string;

      if (!message) {
        alert('message is required!');
        return;
      }

      if (message.split(' ').length > 30) {
        alert('message must be less than 31 words!');
        return;
      }

      await writeContractAsync({
        abi: messageBoard.abi,
        address: CONTRACT_ADDRESS,
        functionName: 'create',
        args: [message],
      });
    } catch (error: any) {
      console.log(error);
      alert(error.message);
    }
  }

  if (confirmed) {
    alert('Operation successfull!');
    window.location.reload();
  }

  if (error) {
    return (
      <>
        <h3>An error occurred</h3>
        <code>{error.details}</code>
      </>
    );
  }

  if (messagesLoading) {
    return (
      <>
        <h3>Loading messages...</h3>
      </>
    );
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="form-wrapper">
          <form action={formAction}>
            <textarea
              placeholder="your message goes here... (max 30 words)"
              name="message"
              id="message"
            ></textarea>
            <button disabled={pending && loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>

        <div className="messages">
          <div className="message-filter">
            <label htmlFor="filter">Choose which messages to show: </label>
            <select name="filter" id="filter" onChange={handleFilter}>
              <option value="all">All</option>
              <option value="mine">Mine</option>
              <option value="not-spam">Non Spam</option>
            </select>

            <span>{filterText}</span>
          </div>

          <div className="message-cards">
            {messages.map((message) => {
              return (
                <>
                  <Card
                    key={message.messageId}
                    claps={message.claps}
                    isSpam={message.isSpam}
                    creator={message.creator}
                    message={message.message}
                    messageId={message.messageId}
                    timestamp={message.timestamp}
                    currentAddress={currentAddress as Address}
                    contractOwner={CONTRACT_OWNER}
                    disableClap={pending && loading}
                    handleClap={handleClap}
                    handleSpamToggle={handleSpamToggle}
                  />
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
