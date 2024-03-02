import style from "./MenuCard.module.css";
import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
}

export default function MenuCard({href, children}: Props) {
    return (
        <Link href={href} className='link_btn'>
            <div className={style.container}>
                <span>{children}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M1 13L7 7L1 1" stroke="#DADBDE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </Link>
    )
}