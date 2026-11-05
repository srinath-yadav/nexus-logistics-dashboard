import { useParams } from "react-router-dom";

const ShipmentDetail = () => {
  const { id } = useParams();
  return (
    <>
      <h1>ShipmentDetail id :{id}</h1>
    </>
  );
};

export default ShipmentDetail;
