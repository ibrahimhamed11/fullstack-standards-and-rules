import axiosInstance from '../../core/axiosInstance';
import { ENDPOINTS } from '../../core/endpoints';
import type { CreateEntityDto, Entity, UpdateEntityDto } from './types';

export const getEntities = async (): Promise<Entity[]> => {
  const response = await axiosInstance.get(ENDPOINTS.entity.all);
  return response.data?.data || response.data || [];
};

export const getEntityById = async (id: string): Promise<Entity> => {
  const response = await axiosInstance.get(ENDPOINTS.entity.byId(id));
  return response.data?.data || response.data;
};

export const createEntity = async (dto: CreateEntityDto): Promise<Entity> => {
  const response = await axiosInstance.post(ENDPOINTS.entity.create, dto);
  return response.data?.data || response.data;
};

export const updateEntity = async (id: string, dto: UpdateEntityDto): Promise<Entity> => {
  const response = await axiosInstance.put(ENDPOINTS.entity.byId(id), dto);
  return response.data?.data || response.data;
};

export const deleteEntity = async (id: string): Promise<void> => {
  await axiosInstance.delete(ENDPOINTS.entity.byId(id));
};

export const entityAPI = {
  getEntities,
  getEntityById,
  createEntity,
  updateEntity,
  deleteEntity,
};

export default entityAPI;
