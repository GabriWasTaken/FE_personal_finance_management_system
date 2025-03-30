import React from 'react';
import i18next from 'i18next';
import { languages } from '@/utils/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLogto } from '@logto/react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '@/utils/ThemeToggle';

function Topbar() {
  const { signOut } = useLogto();
  const { t } = useTranslation();

  const username = localStorage.getItem("username");

  const logOut = () => {
    localStorage.removeItem("isAuthenticated");
    signOut();
  }

  return (
    <div data-testid="topbar" className="flex justify-end items-center gap-4 mr-4">
      <Select defaultValue={i18next.language} onValueChange={(value) => i18next.changeLanguage(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Languages</SelectLabel>
              {languages.map((language) => (
                <SelectItem value={language} key={language}>{language}</SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <button onClick={logOut}>{t('logout')}</button>
      {username && <p>Ciao {username}</p>}
      <ThemeToggle />
    </div>
  )
}

export default Topbar