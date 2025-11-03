type Tstatus = "unlisted" | "listed" | "occupied";

type ItemProps = {
    data: {
        image: string;
        title: string;
        roomNum: string;
        status: Tstatus;
    }
}

export default function Item({ data }: ItemProps) {
  return (
    <div>
      <img src={ data.image }/>
      <div>
        <h2>{data.title}</h2>
        <span>{data.roomNum}</span>
      </div>
      <span>{data.status}</span>
    </div>
  );
}
