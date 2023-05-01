interface Props {
  params: {
    collection: string;
  };
}

function page({params}: Props) {
  const {collection} = params
  return (
    <div>Page {collection}</div>
  )
}

export default page