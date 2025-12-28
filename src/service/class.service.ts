import ClassModel from '../models/class.model.ts';

export const createClassService = async (
  className: string,
  teacherId: string,
) => {
  const newClass = await ClassModel.create({
    className,
    teacherId,
    studentIds: [],
  });

  return newClass;
};
