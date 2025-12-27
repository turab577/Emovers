"use client";

import PrimaryBtn from "../ui/buttons/PrimaryBtn";
import SecondaryBtn from "../ui/buttons/SecondaryBtn";
import Input from "../ui/Input";
import Table from "./Table";

const page = () => {
  return (
    <div className="space-y-3">
      {/* primary btns */}
      <div className="space-y-1">
        <h1 className="text-2xl">Primary Btns variations</h1>
        <div className="flex items-center justify-between gap-10">
          <PrimaryBtn
            variant="filled"
            label="Primary filled Btn"
            width="100%"
            imageSrc="/images/filled-arrow.svg"
            imagePosition="right"
          />
          <PrimaryBtn
            variant="outlined"
            label="Primary filled Btn"
            width="100%"
            imageSrc="/images/outlined-arrow.svg"
            imagePosition="right"
          />
          <PrimaryBtn
            variant="soft"
            label="Primary filled Btn"
            width="100%"
            imageSrc="/images/soft-arrow.svg"
            imagePosition="right"
          />
        </div>
      </div>

      {/* secondary btns */}

      <div className="space-y-1">
        <h1 className="text-2xl">Secondary Btns variations</h1>
        <div className="flex items-center justify-between gap-10">
          <SecondaryBtn
            variant="filled"
            label="Secondary filled Btn"
            width="100%"
            imageSrc="/images/secondary-filled.svg"
            imagePosition="right"
          />  
          <SecondaryBtn
            variant="outlined"
            label="Secondary filled Btn"
            width="100%"
            imageSrc="/images/secondary-outlined.svg"
            imagePosition="right"
          />
          <SecondaryBtn
            variant="soft"
            label="Secondary filled Btn"
            width="100%"
            imageSrc="/images/secondary-soft.svg"
            imagePosition="right"
          />
        </div>
      </div>

      {/* typography */}
      <div className="space-y-1">
        <h1 className="text-2xl">Typography</h1>
        <div className="flex gap-40">
          <div>
            <h2 className="text-xl">Heading fonts</h2>
            <div className="space-y-2 pt-2">
              <p className="heading-1">Heading 1</p>
              <p className="heading-2">Heading 2</p>
              <p className="heading-3">Heading 3</p>
              <p className="heading-4">Heading 4</p>
              <p className="heading-5">Heading 5</p>
              <p className="heading-6">Heading 6</p>
              <p className="heading-7">Heading 7</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl">Body fonts</h2>
            <div className="space-y-2 pt-2">
              <p className="body-1">Body 1</p>
              <p className="body-2">Body 2</p>
              <p className="body-3">Body 3</p>
              <p className="body-4">Body 4</p>
              <p className="body-5">Body 5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl">Inputs</h1>
        <Input
          title="Username"
          placeholder="Enter your username"
          className="w-full"
          // value={username}
          // onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* table */}
      <div className="space-y-1">
        <h1 className="text-2xl">Table</h1>
        <Table />
      </div>
    </div>
  );
};

export default page;
