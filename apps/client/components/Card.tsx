import formatChineseDate from '@/utils/formatChineseDate';

type Tag = {
  id: number;
  tagName: string;
  color: string;
};

type Props = {
  id: string;
  label: string;
  labelComments: Tag[];
  title: string;
  content: string;
  previewUrl: string | null;
  avatarUrl?: string;
  avatarName: string;
  time: Date;
  horizontal?: boolean;
};

function Card({
  label,
  labelComments,
  title,
  content,
  previewUrl,
  avatarName,
  time,
  horizontal = false,
}: Props) {
  return (
    <div className="relative h-full bg-label">
      <div
        className={`absolute w-full h-2/3  bg-no-repeat bg-cover ${
          !horizontal && 'lg:w-2/3 lg:h-full'
        }`}
        style={{
          backgroundImage: `url('${previewUrl || '/images/banner-temp.jpeg'}')`,
        }}
      />
      <div
        className={`absolute w-full h-1/6 top-[16.67%] ${
          !horizontal && 'lg:w-1/6 lg:left-1/3 lg:h-full lg:top-0'
        }`}
        style={{
          background: `${
            horizontal
              ? 'var(--gradient-cover-down)'
              : 'var(--gradient-cover-right)'
          }`,
        }}
      ></div>
      <div
        className={`absolute h-2/3 w-full bottom-0 px-5 pb-8 text-label text-ellipsis bg-background ${
          !horizontal && 'lg:w-1/2 lg:h-full lg:right-0 lg:py-10 lg:pr-10'
        }`}
      >
        <div className="w-full h-full flex flex-col">
          <div
            className={`flex items-center gap-5 mb-1 ${
              !horizontal && 'lg:mb-5'
            }`}
          >
            <h2
              className={`text-sm text-label-colorful font-bold ${
                !horizontal && 'lg:text-base'
              }`}
            >
              {label}
            </h2>
            {labelComments.map((tag) => (
              <h3
                key={tag.id}
                className={`text-sm text-content-main italic ${
                  !horizontal && 'lg:text-base'
                }`}
              >
                #{tag.tagName}
              </h3>
            ))}
          </div>
          <h1
            className={`text-2xl font-bold mb-3 ${
              !horizontal && 'lg:text-4xl lg:mb-8'
            }`}
          >
            {title}
          </h1>
          <p
            className="text-content-main text-lg ellipsis"
            style={{ '--lineNum': '4' } as React.CSSProperties}
          >
            {content}
          </p>
          <div className="flex items-center gap-3 mt-auto">
            <div className="w-6 h-6 rounded-full bg-white flex justify-center items-center text-black">
              Z
            </div>
            <span className="text-content-main">{avatarName}</span>
            <span className="text-content-sub text-sm">
              发布于 {formatChineseDate(time)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
