import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../reducer/AuthSlice";
import DeptSlice from "../reducer/DeptSlice";
import SemSlice from "../reducer/SemSlice";
import FeedbackSlice from "../reducer/FeedbackSlice";
import NotesSlice from "../reducer/NotesSlice";
import SubSlice from "../reducer/SubSlice";
import InboxSlice from "../reducer/InboxSlice";
import AttendenceSlice from "../reducer/AttendanceSlice";
import BookSlice from "../reducer/BookSLice";
import TopicSlice from "../reducer/TopicSlice";
import AssignmentSlice from "../reducer/AssignmenSlice";
import SyllabusSlice from "../reducer/SyllabusSlice";
import AssignmentUploadSlice from "../reducer/AssignmentUpload";
import MarksSlice from "../reducer/MarksSlice";

export const store=configureStore(
    {
        reducer:{
            auth:AuthSlice,
            depts:DeptSlice,
            sems:SemSlice,
            feedbacks: FeedbackSlice,
            notes: NotesSlice,
            subs: SubSlice,
            inbox: InboxSlice,
            attendance: AttendenceSlice,
            book: BookSlice,
            topic: TopicSlice,
            assignment: AssignmentSlice,
            assignmentUpload: AssignmentUploadSlice,
            mark: MarksSlice,
            syllabus: SyllabusSlice
        }
    }
)