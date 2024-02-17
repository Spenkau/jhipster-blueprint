import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExample, NewExample } from '../example.model';

export type PartialUpdateExample = Partial<IExample> & Pick<IExample, 'id'>;

export type EntityResponseType = HttpResponse<IExample>;
export type EntityArrayResponseType = HttpResponse<IExample[]>;

@Injectable({ providedIn: 'root' })
export class ExampleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/examples');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  copy(example: IExample): Observable<EntityResponseType> {
    return this.http.post<IExample>(`${this.resourceUrl}/copy`, example, { observe: 'response' });
  }

  create(example: NewExample): Observable<EntityResponseType> {
    return this.http.post<IExample>(this.resourceUrl, example, { observe: 'response' });
  }

  update(example: IExample): Observable<EntityResponseType> {
    return this.http.put<IExample>(`${this.resourceUrl}/${this.getExampleIdentifier(example)}`, example, { observe: 'response' });
  }

  partialUpdate(example: PartialUpdateExample): Observable<EntityResponseType> {
    return this.http.patch<IExample>(`${this.resourceUrl}/${this.getExampleIdentifier(example)}`, example, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IExample>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IExample[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExampleIdentifier(example: Pick<IExample, 'id'>): number {
    return example.id;
  }

  compareExample(o1: Pick<IExample, 'id'> | null, o2: Pick<IExample, 'id'> | null): boolean {
    return o1 && o2 ? this.getExampleIdentifier(o1) === this.getExampleIdentifier(o2) : o1 === o2;
  }

  addExampleToCollectionIfMissing<Type extends Pick<IExample, 'id'>>(
    exampleCollection: Type[],
    ...examplesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const examples: Type[] = examplesToCheck.filter(isPresent);
    if (examples.length > 0) {
      const exampleCollectionIdentifiers = exampleCollection.map(exampleItem => this.getExampleIdentifier(exampleItem)!);
      const examplesToAdd = examples.filter(exampleItem => {
        const exampleIdentifier = this.getExampleIdentifier(exampleItem);
        if (exampleCollectionIdentifiers.includes(exampleIdentifier)) {
          return false;
        }
        exampleCollectionIdentifiers.push(exampleIdentifier);
        return true;
      });
      return [...examplesToAdd, ...exampleCollection];
    }
    return exampleCollection;
  }
}
