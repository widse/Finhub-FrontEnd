'use client'

import { Suspense, useState } from 'react';
import style from './ScrapContent.module.css';
import ScrapIcon from "@/assets/Icons";
import { LinkButton } from '@/components/LinkButton';
import { queryKeys, useMyScrap } from '@/states/server/queries';
import { MyColumnScarp, MyScrapRequest, MyTopicScarp } from '@/model/MyScrap';
import Loading from '@/app/loading';
import { useScrap } from '@/states/server/mutations';
import { useToast } from '@/components/Toast/useToast';
import { useQueryClient } from '@tanstack/react-query';
import { Toggle } from '@/components/Toggle/Toggle';

type ScrapTopicItemProps = {
  data: MyTopicScarp,
  onScrapClick: (e: React.MouseEvent) => void
}
const ScrapTopicItem = ({ data, onScrapClick }: ScrapTopicItemProps) => {
  return (
    <LinkButton href={`/${data.categoryId}/${data.topicId}`}>
      <div className={style.item_container}>
        <div className={style.img_box}></div>
        <div className={style.content_box}>
          <p>{data.title}</p>
          <p>{data.definition}</p>
        </div>
        <div className={style.icon_box} onClick={onScrapClick}>
          <ScrapIcon active={true} />
        </div>
      </div>
    </LinkButton>
  )
}

type ScrapColumnItemProps = {
  data: MyColumnScarp,
  onScrapClick: (e: React.MouseEvent) => void
}
const ScrapColumnItem = ({ data, onScrapClick }: ScrapColumnItemProps) => {
  return (
    <LinkButton href={`/feed/column/${data.columnId}`}>
      <div className={style.item_container}>
        <div className={style.img_box}></div>
        <div className={style.content_box}>
          <p>{data.title}</p>
          <p>{data.summary}</p>
        </div>
        <div className={style.icon_box} onClick={onScrapClick}>
          <ScrapIcon active={true} />
        </div>
      </div>
    </LinkButton>
  )
}

type SrapListProps = {
  type: MyScrapRequest
}
const SrapList = ({type}: SrapListProps) => {
  const { showToast } = useToast();

  const { data: myScrap, refetch } = useMyScrap(type);
  const topicScrapList = myScrap as MyTopicScarp[] ?? [];
  const columnScrapList = myScrap as MyColumnScarp[] ?? [];

  const queryClient = useQueryClient();
  const scrapMutation = useScrap({
    onSuccess: (data, variable) => {
      if (data.status === "FAIL") {
        showToast({content: "잠시 후 다시 시도해주세요.", type: "warning"});
        return;
      }

      queryClient.invalidateQueries({queryKey: queryKeys.myScrap(type)});
      if (type === "topic") {
        queryClient.invalidateQueries({ queryKey: queryKeys.topicInfo(variable.id)});
        queryClient.invalidateQueries({queryKey: queryKeys.topicList(variable.categoryId)});
      }
      if (type === "column") {
        queryClient.invalidateQueries({ queryKey: queryKeys.gptColumnDetail(variable.id)});
      }

      refetch();
    },
    onError: () => {
      showToast({content: "잠시후 다시 시도해주세요!", type: "warning"});
    }
  });
  
  const handleScrapTopicClick = (id: number, categoryId: number, e: React.MouseEvent) => {
    e.preventDefault();
    scrapMutation.mutate({id, type: 1, categoryId});
  }
    
  const handleScrapColumnClick = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    scrapMutation.mutate({id, type: 2});
  }

  return (
    <div className={style.item_list}>
      <div className={style.topic_list}>
        {type === "topic"
          ? topicScrapList.map(item => (
            <ScrapTopicItem
              key={`${item.categoryId}_${item.topicId}`}
              data={item}
              onScrapClick={(e) => handleScrapTopicClick(item.topicId, item.categoryId ,e)}
            />
          ))
          : columnScrapList.map(item => (
            <ScrapColumnItem
              key={`${item.columnId}`}
              data={item}
              onScrapClick={(e) => handleScrapColumnClick(item.columnId, e)}
            />
          ))
        }
      </div>
    </div>
  )
}

enum TOGGLE_TYPE {
  topic = 0,
  column = 1,
}

export default function ScrapContent() {
  const [toggleType, setToggleType] = useState<number>(0);

  const handleToggleClick = (value: TOGGLE_TYPE) => {
    setToggleType(value);
  }

  const getTypeString = (type: TOGGLE_TYPE): 'topic' | 'column' => {
    return TOGGLE_TYPE[type] as 'topic' | 'column';
  }

  return (
    <div className={style.container}>
      <Toggle 
        data={[
          {text: '단어', value: TOGGLE_TYPE.topic},
          {text: '컬럼', value: TOGGLE_TYPE.column}
        ]}
        selectedValue={toggleType}
        onChange={handleToggleClick}
      />
      <Suspense fallback={<Loading height={300}/>}>
        <SrapList type={getTypeString(toggleType)}/>
      </Suspense>
    </div>
  )
}