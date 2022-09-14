import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import VacationModel from "../../../Models/vacationModel";
import vacationsService from "../../../Services/VacationsService";
import "./AddVacation.css";

function AddVacation(): JSX.Element {

    const { register, handleSubmit, formState, setValue } = useForm<VacationModel>()
    const navigate = useNavigate()
    const [image, setImage] = useState<string>()


    async function send(vacation: VacationModel) {
        try {
            await vacationsService.addVacation(vacation)
            // notify message
            navigate("/home")

        } catch (err: any) {
            // notify message
        }
    }

    function onImageChange(e: React.FormEvent<HTMLInputElement>) {
        const files = e.currentTarget.files
        const file = files[0]
        console.log(file);
        setImage(URL.createObjectURL(file))

    }

    return (
        <div className="AddVacation">
			
            <form onSubmit={handleSubmit(send)}>
                <div className="input-label-wrapper">
                    <label htmlFor="destination">Destination</label>
                    <input type="text" id="destination" {...register("destination", {
                        required: { value: true, message: "Destination is required" },
                        minLength: { value: 2, message: "Destination is too short" },
                        maxLength: { value: 50, message: "Destination is too long" }
                    })} />
                    <span className="hint">{formState.errors.destination?.message}</span>
                </div>
                <div className="input-label-wrapper">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" {...register("description", {
                        required: { value: true, message: "Description is required" },
                        minLength: { value: 2, message: "Description is too short" },
                        maxLength: { value: 500, message: "Description is too long" }
                    })} />
                    <span className="hint">{formState.errors.description?.message}</span>
                </div>
                <div className="input-label-wrapper">
                    <label htmlFor="startDate">Start on</label>
                    <input type="date" id="startDate" {...register("startDate", {
                        required: { value: true, message: "Start date is required" },
                        minLength: { value: 8, message: "Start date is too short" },
                        maxLength: { value: 100, message: "Start date is too long" }
                    })} />
                    <span className="hint">{formState.errors.startDate?.message}</span>
                </div>
                <div className="input-label-wrapper">
                    <label htmlFor="endDate">End on</label>
                    <input type="date" id="endDate" {...register("endDate", {
                        required: { value: true, message: "Start date is required" },
                        minLength: { value: 8, message: "Start date is too short" },
                        maxLength: { value: 100, message: "Start date is too long" },
                    })} />
                    <span className="hint">{formState.errors.endDate?.message}</span>
                </div>
                <div className="input-label-wrapper">
                    <label htmlFor="price">Price</label>
                    <input type="number" id="price" {...register("price", {
                        required: { value: true, message: "Price is required" },
                        min: { value: 0, message: "Username is too short" },
                    })} />
                    <span className="hint">{formState.errors.price?.message}</span>
                </div>
                <div className="input-label-wrapper">
                    <label htmlFor="image" id="imgLabel">Change image
                        <img src={image} />
                    </label>
                    <input type="file" id="image" accept="image/*" {...register("image")} onChange={onImageChange} />
                    <span className="hint">{formState.errors.image?.message}</span>
                </div>
                <button>Add Vacation</button>
            </form>
            
        </div>
    );
}

export default AddVacation;
