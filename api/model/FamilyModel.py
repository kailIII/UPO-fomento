from model.base.PostgreSQL.PostgreSQLModel import PostgreSQLModel
import base

class FamilyModel(PostgreSQLModel):
    
    def getFamilyList(self):
        sql = "SELECT f.cod_familia, name_familia, cod_indicador, name_indicador, (select count(*) from geoserver.indicador_fecha fecha where cod_indicador = i.cod_indicador) as count, (select fecha from geoserver.indicador_fecha fecha where cod_indicador = i.cod_indicador order by fecha limit 1) as fecha" \
                " from geoserver.familia f" \
                 " inner join geoserver.indicador i on i.cod_familia = f.cod_familia order by cod_familia, name_indicador";

        return self.query(sql).result()
