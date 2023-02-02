import { useEffect, useState } from "react";
// Icon
import { XMarkIcon } from "@heroicons/react/24/outline";
// Firebase
import { db } from "../FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
// Toast
import { toast } from "react-toastify";

function EditModal({ id, setEditMode }) {
  const [currentData, setCurrentData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCurrentData = () => {
      getDoc(doc(db, "coordinates", id))
        .then((response) => {
          setCurrentData(response.data());
        })
        .catch((error) => {
          toast(error.message);
        });
    };
    getCurrentData();
  }, [id]);

  const inputHandler = (e) => {
    setCurrentData((prevState) => {
      return {
        ...prevState,
        [e.target.id]: e.target.value,
      };
    });
  };

  const editHandler = async () => {
    setLoading(true);
    if (id) {
      await updateDoc(doc(db, "coordinates", id), {
        latitude: currentData.latitude,
        longitude: currentData.longitude,
      })
        .then(() => {
          toast("Data Changed");
          setEditMode(false);
        })
        .catch((error) => toast(error.message));
    }
    setLoading(false);
  };

  return (
    <div className="fixed left-0 top-0 right-0 bottom-0 z-[999] flex items-center justify-center bg-black/[0.4]">
      <div className="bg-white p-5 text-black rounded-md flex flex-col space-y-5 w-[95%] lg:w-[50%] max-h-[90%]">
        <div className="flex justify-end">
          <XMarkIcon
            onClick={() => setEditMode(false)}
            className="h-[1.5rem] w-auto cursor-pointer"
          />
        </div>
        <div className="text-center text-[1.5rem]">Edit Coordinate</div>
        <div className="flex flex-col space-y-3">
          <label>Latitude</label>
          <input
            id="latitude"
            placeholder="Input Latitude"
            value={currentData.latitude}
            type="number"
            className="border p-2 rounded-md outline-none"
            onChange={(e) => inputHandler(e)}
          />
        </div>
        <div className="flex flex-col space-y-3">
          <label>Longitude</label>
          <input
            id="longitude"
            placeholder="Input Longitude"
            value={currentData.longitude}
            type="number"
            className="border p-2 rounded-md outline-none"
            onChange={(e) => inputHandler(e)}
          />
        </div>
        <button
          onClick={() => editHandler()}
          className="w-full p-3 border text-white rounded-md bg-[#6366F1]"
        >
          {loading ? "Loading..." : "Change Data"}
        </button>
      </div>
    </div>
  );
}

export default EditModal;
