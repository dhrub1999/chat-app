'use client';
import { FC, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Button from './ui/Button';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const sendMessage = async () => {
    if (!input) return;
    setLoading(true);

    try {
      await axios.post('/api/message/send', { text: input, chatId });
      setInput('');
      textareaRef.current?.focus();
    } catch (error) {
      toast.error('Something went wrong, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mb-2 border-t border-slate-300 px-4 pt-4 sm:mb-0'>
      <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-400 focus-within:ring-2 focus-within:ring-indigo-600'>
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}...`}
          className='block w-full resize-none border-0 bg-transparent font-raleway font-medium text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
        />

        <div
          className='py-2'
          area-hidden='true'
          onClick={() => textareaRef.current?.focus()}
        >
          <div className='py-px'>
            <div className='h-9' />
          </div>
        </div>

        <div className='absolute bottom-0 right-0 flex justify-between py-2 pl-3 pr-2'>
          <div className='flex-shrink-0'>
            <Button onClick={sendMessage} type='submit' isLoading={loading}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
