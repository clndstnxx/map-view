import React, { useEffect, useState } from "react";

// Icons
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

// Firebase
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./FirebaseConfig";

// React Toastify
import { ToastContainer, toast } from "react-toastify";

// Styling
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// Components
import EditModal from "./components/EditModal";

// Google Maps
import GoogleMapReact from "google-map-react";
import MapMarkerIcon from "./assets/mapmarker.png";

function App() {
  const [inputData, setInputData] = useState({
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [coordinatesData, setCoordinatesData] = useState([]);

  useEffect(() => {
    onSnapshot(collection(db, "coordinates"), (snapshot) => {
      let newArray = [];
      snapshot.docs.map((x) => newArray.push({ ...x.data(), id: x.id }));
      setCoordinatesData(newArray);
    });
  }, []);

  const inputHandler = (e) => {
    setInputData((prevState) => {
      return {
        ...prevState,
        [e.target.id]: e.target.value,
      };
    });
  };

  const submitHandler = async () => {
    setLoading(true);
    if (inputData.latitude !== "" && inputData.longitude !== "") {
      await addDoc(collection(db, "coordinates"), {
        latitude: inputData.latitude,
        longitude: inputData.longitude,
        createdAt: serverTimestamp(),
      })
        .then(() => {
          toast("Coordinate Saved Successfully");
          setInputData({
            latitude: "",
            longitude: "",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      toast("Please input latitude & longitude");
    }
    setLoading(false);
  };

  const deleteHandler = (id) => {
    if (id) {
      deleteDoc(doc(db, "coordinates", id))
        .then(() => {
          toast("Coordinate Deleted");
        })
        .catch((error) => console.log(error));
    }
  };

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 2,
  };

  const CustomMarker = ({ lat, lng }) => {
    return (
      <div className="map-hover cursor-pointer relative">
        <div className="map-box absolute top-0 right-0 p-2 bg-black rounded-md transition-all whitespace-nowrap z-[999]">
          <div>Lat : {lat}</div>
          <div>Lng : {lng}</div>
        </div>
        <img className="h-[2rem] w-auto" src={MapMarkerIcon} alt="" />
      </div>
    );
  };

  return (
    <div className="bg-primary text-white p-5">
      <ToastContainer
        autoClose={1000}
        progressStyle={{ background: "green" }}
      />
      {editMode && (
        <EditModal
          editMode={editMode}
          setEditMode={setEditMode}
          id={currentId}
        />
      )}
      <div className="flex items-center justify-center">
        <div style={{ height: "50vh", width: "50%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: process.env.REACT_APP_GOOGLE_API_KEY,
            }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          >
            {coordinatesData?.map((x) => {
              return (
                <CustomMarker key={x.id} lat={x.latitude} lng={x.longitude} />
              );
            })}
          </GoogleMapReact>
        </div>
      </div>
      <div className="flex flex-col space-y-5 md:space-y-0 md:flex-row md:items-center md:space-x-3 w-full mt-5">
        <input
          type="number"
          id="latitude"
          onChange={(e) => inputHandler(e)}
          className="w-full md:w-[40%] h-[40px] px-2 outline-none text-black"
          placeholder="Input Latitude"
          value={inputData.latitude}
        />
        <input
          type="number"
          id="longitude"
          onChange={(e) => inputHandler(e)}
          className="w-full md:w-[40%] h-[40px] px-2 outline-none text-black"
          placeholder="Input Longitude"
          value={inputData.longitude}
        />
        <button
          onClick={() => submitHandler()}
          className="w-full md:w-[20%] bg-[#6366F1] font-semibold cursor-pointer h-[40px] px-2 hover:brightness-110"
        >
          {loading ? "Loading.." : "Save Coordinate"}
        </button>
      </div>
      <div className="w-full overflow-auto mt-5">
        <table className="w-full whitespace-nowrap text-center">
          <thead>
            <tr>
              <td>No</td>
              <td>Latitude</td>
              <td>Longitude</td>
              <td>Created At</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {coordinatesData?.map((x, index) => {
              return (
                <tr key={x.id}>
                  <td>{index + 1}</td>
                  <td>{x.latitude}</td>
                  <td>{x.longitude}</td>
                  <td>{x.createdAt?.toDate()?.toString()}</td>
                  <td>
                    <div className="w-full flex items-center justify-center space-x-5">
                      <PencilSquareIcon
                        onClick={() => {
                          setEditMode(true);
                          setCurrentId(x.id);
                        }}
                        className="h-[1.5rem] w-auto cursor-pointer"
                      />
                      <TrashIcon
                        onClick={() => deleteHandler(x.id)}
                        className="h-[1.5rem] w-auto cursor-pointer"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
